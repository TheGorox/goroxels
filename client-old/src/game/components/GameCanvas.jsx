import styles from "@/styles/components/GameCanvas.module.css"
import { useEffect, useRef } from "react"
import init from "@/js/game/init";



export default function GameCanvas() {
    const mainBoardRef = useRef(null);
    const fxBoardRef = useRef(null);

    const onWindowResize = () => {
        const mainBoard = mainBoardRef.current;
        const fxBoard = mainBoardRef.current;

        if(!mainBoard || !fxBoard) return;

        mainBoard.width = window.innerWidth;
        mainBoard.height = window.innerHeight;

        fxBoardRef.width = window.innerWidth;
        fxBoardRef.height = window.innerHeight;

        const ctx = mainBoard.getContext('2d');
        const fxCtx = fxBoardRef.getContext('2d');

        // on some devices, smoothing resets after the resize
        ctx.imageSmoothingEnabled = false;
        fxCtx.imageSmoothingEnabled = false;
    }
    
    
    useEffect(() => {
        const cleanup = init();
        window.addEventListener('resize', onWindowResize);

        return cleanup;
    }, [])

    return <>
        <canvas ref={mainBoardRef} className={styles.canvas}></canvas>
        <canvas ref={fxBoardRef} className={styles.canvas}></canvas>
    </>
}