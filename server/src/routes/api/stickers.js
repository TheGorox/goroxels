const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { body, validationResult } = require('express-validator');

const Sticker = require('../../db/models/Sticker');
const StickerPack = require('../../db/models/StickerPack');

const roleRequired = require('../../utils/roleRequired');
const { rateLimiter } = require('../../utils/express');
const { randomFileName } = require('../../utils/misc');

const logger = require('../../logger')('API/STICKER_PACKS');

const router = express.Router();

const dataPath = path.resolve(__dirname, '../../../data');
const packIconsPath = path.join(dataPath, 'stickers/packIcons');
const stickerIconsPath = path.join(dataPath, 'stickers/icons');
const stickersPath = path.join(dataPath, 'stickers/img');

for(const dataPath of [packIconsPath, stickerIconsPath, stickersPath]){
    if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, { recursive: true });
    }
}

function error(res, msg, status = 400) {
    return res.status(status).json({ errors: [msg] });
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1048576 * 5 }
});

const limiter = rateLimiter.byUserId({ time: 60 * 1000, max: 50 });

router.post(
    '/add',
    roleRequired.admin,
    limiter,
    upload.single('file'),
    [
        body('code')
            .optional({ checkFalsy: true })
            .isString()
            .trim()
            .isLength({ min: 2, max: 32 })
            .escape(),
        body('packId')
            .optional({ checkFalsy: true })
            .isInt({ min: 1 })
            .toInt()
    ],
    async (req, res) => {
        // 1. Проверка ошибок express-validator
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        // 2. Проверка наличия файла
        if (!req.file) {
            return error(res, 'sticker file is required');
        }

        let stickerPath = null, iconPath = null;

        try {
            // 3. Валидация изображения через sharp (в памяти)
            const meta = await sharp(req.file.buffer).metadata();

            // Проверка формата (PNG или WebP)
            if (!['png', 'webp'].includes(meta.format)) {
                return error(res, 'sticker must be PNG or WebP format');
            }

            const { width, height } = meta;

            // Проверка соотношения сторон (не более 2:1 в любую сторону)
            const aspectRatio = Math.max(width, height) / Math.min(width, height);
            if (aspectRatio > 2) {
                return error(res, 'aspect ratio must not exceed 2:1');
            }

            // 4. Логика стикерпака (General по умолчанию)
            let packId = req.body.packId;
            if (!packId) {
                const [defaultPack] = await StickerPack.findOrCreate({
                    where: { title: 'General' },
                    defaults: { title: 'General', isPublic: true }
                });
                packId = defaultPack.id;
            } else {
                const packExists = await StickerPack.findByPk(packId);
                if (!packExists) {
                    return error(res, 'sticker pack not found');
                }
            }

            // 5. Генерируем уникальное имя и сохраняем файл на диск
            const fileName = randomFileName() + '.png';
            stickerPath = path.join(stickersPath, fileName);

            const iconFileName = randomFileName() + '.png';
            iconPath = path.join(stickerIconsPath, iconFileName);

            await sharp(req.file.buffer)
                .resize(64, 64, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .toFile(iconPath);

            await fs.promises.writeFile(stickerPath, req.file.buffer);
            console.log({stickerPath})

            const sticker = await Sticker.create({
                packId,
                code: req.body.code || null,
                imageUrl: `/uploads/stickers/img/${fileName}`,
                thumbUrl: `/uploads/stickers/icons/${iconFileName}`,
                width,
                height
            });

            return res.json(sticker);

        } catch (err) {
            // Если файл успел сохраниться до сбоя в БД — подчищаем за собой
            if (stickerPath && fs.existsSync(stickerPath)) {
                await fs.promises.unlink(stickerPath).catch(() => { });
            }

            if (iconPath && fs.existsSync(iconPath)) {
                await fs.promises.unlink(iconPath).catch(() => { });
            }

            logger.error(err);
            return error(res, 'failed to upload sticker, try again later', 500);
        }
    }
);

let packsCache = null;

function invalidateStickersCache() {
    packsCache = null;
}

// ------------------------------------------
// 1. СОЗДАНИЕ СТИКЕРПАКА (POST /pack/add)
// ------------------------------------------
router.post(
    '/pack/add',
    roleRequired.admin,
    limiter,
    upload.single('icon'), // Иконка пака (опционально)
    [
        body('title')
            .isString()
            .trim()
            .isLength({ min: 2, max: 64 })
            .escape(),
        body('sortOrder')
            .optional()
            .isInt()
            .toInt()
    ],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        let iconFileName = null;
        let iconPath = null;

        try {
            // Если загрузили иконку — валидируем и сохраняем
            if (req.file) {
                const meta = await sharp(req.file.buffer).metadata();
                if (!['png', 'webp'].includes(meta.format)) {
                    return error(res, 'icon must be PNG or WebP format');
                }

                // Иконка пака должна быть квадратной (например 1:1)
                if (meta.width !== meta.height) {
                    return error(res, 'pack icon must be square (1:1 ratio)');
                }

                iconFileName = randomFileName() + '.png';
                iconPath = path.join(packIconsPath, iconFileName);

                // Ресайзим иконку до 64x64 для оптимизации
                await sharp(req.file.buffer)
                    .resize(64, 64)
                    .toFile(iconPath);
            }

            const pack = await StickerPack.create({
                title: req.body.title,
                isPublic: true,
                sortOrder: req.body.sortOrder || 0,
                iconUrl: iconFileName ? `/uploads/stickers/packIcons/${iconFileName}` : null
            });

            // Сбрасываем кэш, так как появился новый пак!
            invalidateStickersCache();

            return res.json(pack);

        } catch (err) {
            if (iconPath && fs.existsSync(iconPath)) {
                await fs.promises.unlink(iconPath).catch(() => { });
            }

            logger.error(err);
            return error(res, 'failed to create sticker pack', 500);
        }
    }
);

// ------------------------------------------
// 2. ПОЛУЧЕНИЕ ВСЕХ ПАКОВ СО СТИКЕРАМИ (GET /list)
// ------------------------------------------
router.get(
    '/list',
    roleRequired.user,
    async (req, res) => {
        try {
            // Если есть в кэше — отдаем сразу
            if (packsCache) {
                res.setHeader('X-Cache', 'HIT'); // Флаг для отладки
                return res.json(packsCache);
            }

            // Если кэша нет — ищем в БД
            const packs = await StickerPack.findAll({
                where: { isPublic: true },
                include: [
                    {
                        model: Sticker,
                        as: 'stickers',
                        attributes: ['id', 'code', 'imageUrl', 'thumbUrl', 'width', 'height', 'sortOrder']
                    }
                ],
                order: [
                    ['sortOrder', 'DESC'],
                    [{ model: Sticker, as: 'stickers' }, 'sortOrder', 'DESC']
                ]
            });

            // Сохраняем результат в кэш
            packsCache = packs;

            res.setHeader('X-Cache', 'MISS');
            return res.json(packs);

        } catch (err) {
            logger.error(err);
            return error(res, 'failed to fetch sticker packs', 500);
        }
    }
);

module.exports = {
    router,
    invalidateStickersCache // Экспортируем функцию сброса кэша
};