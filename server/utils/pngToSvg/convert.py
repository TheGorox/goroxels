#!/usr/bin/env python3
"""
Конвертирует одноцветную (обычно с альфа-каналом) растровую иконку в SVG,
объединяя соседние закрашенные пиксели в прямоугольники.

Алгоритм: для каждой строки считаются горизонтальные "runs" закрашенных
пикселей (x0, x1). Если у соседних строк runs с одинаковыми границами -
они схлопываются в один прямоугольник по высоте. Работает быстро (O(w*h))
и даёт компактный результат для пиксель-арт иконок.

Использование:
    python png_to_svg.py path/to/icon.png [--threshold 128]

Результат сохраняется в ./out/<имя_файла>.svg
Заливка всегда fill="currentColor" - цвет наследуется из CSS.

Зависимости: pip install pillow numpy
"""

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def build_mask(img: Image.Image, threshold: int) -> np.ndarray:
    """Возвращает 2D bool-массив закрашенных пикселей (True = рисуем)."""
    img = img.convert("RGBA")
    arr = np.array(img)

    alpha = arr[:, :, 3]
    # Если есть реальная прозрачность - используем альфа-канал.
    if alpha.min() < 255:
        return alpha >= threshold

    # Иначе иконка непрозрачная: определяем фон по самому частому цвету
    # (обычно это углы/края изображения).
    rgb = arr[:, :, :3].reshape(-1, 3)
    corner_colors = np.array(
        [arr[0, 0, :3], arr[0, -1, :3], arr[-1, 0, :3], arr[-1, -1, :3]]
    )
    bg = corner_colors[0]
    for c in corner_colors:
        if (rgb == c).all(axis=1).sum() > (rgb == bg).all(axis=1).sum():
            bg = c

    diff = np.abs(arr[:, :, :3].astype(int) - bg.astype(int)).sum(axis=2)
    return diff > threshold


def row_runs(row: np.ndarray):
    """Список (x0, x1) непрерывных отрезков True в булевой 1D-строке."""
    runs = []
    x = 0
    w = len(row)
    while x < w:
        if row[x]:
            start = x
            while x < w and row[x]:
                x += 1
            runs.append((start, x))
        else:
            x += 1
    return runs


def mask_to_rects(mask: np.ndarray):
    """Сливает закрашенные пиксели в прямоугольники (x, y, w, h)."""
    h, w = mask.shape
    active: dict[tuple[int, int], int] = {}  # (x0, x1) -> y_start
    rects = []

    for y in range(h):
        runs = row_runs(mask[y])
        runs_set = set(runs)

        # закрываем прямоугольники, которые не продолжились в этой строке
        for key in list(active.keys()):
            if key not in runs_set:
                x0, x1 = key
                y0 = active.pop(key)
                rects.append((x0, y0, x1 - x0, y - y0))

        # открываем новые
        for key in runs:
            if key not in active:
                active[key] = y

    # закрываем всё, что осталось открытым после последней строки
    for (x0, x1), y0 in active.items():
        rects.append((x0, y0, x1 - x0, h - y0))

    return rects


def rects_to_svg(rects, width: int, height: int) -> str:
    path_parts = [f"M{x},{y}h{w}v{h}h{-w}Z" for x, y, w, h in rects]
    d = "".join(path_parts)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {width} {height}" fill="currentColor">'
        f'<path d="{d}"/></svg>'
    )


def convert(input_path: Path, output_path: Path, threshold: int) -> None:
    img = Image.open(input_path)
    mask = build_mask(img, threshold)
    rects = mask_to_rects(mask)
    svg = rects_to_svg(rects, img.width, img.height)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(svg, encoding="utf-8")

    print(f"{input_path.name}: {mask.sum()} px -> {len(rects)} прямоугольник(ов)")
    print(f"Сохранено: {output_path}")


def main():
    parser = argparse.ArgumentParser(description="PNG icon -> SVG (currentColor)")
    parser.add_argument("input", type=Path, help="путь к исходному изображению")
    parser.add_argument(
        "--threshold",
        type=int,
        default=128,
        help="порог альфы/цвета для определения закрашенного пикселя (0-255)",
    )
    args = parser.parse_args()

    if not args.input.exists():
        sys.exit(f"Файл не найден: {args.input}")

    output_path = Path("./out") / (args.input.stem + ".svg")
    convert(args.input, output_path, args.threshold)


if __name__ == "__main__":
    main()