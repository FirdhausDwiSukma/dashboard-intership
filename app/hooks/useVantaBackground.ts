/**
 * Vanta Background Hook
 * Client-side hook for Vanta.js animated background
 */

"use client";

import { useEffect, useRef } from "react";

export const useVantaBackground = (effect: string = "waves") => {
    const vantaRef = useRef<HTMLDivElement>(null);
    const vantaEffect = useRef<any>(null);

    useEffect(() => {
        if (!vantaRef.current) return;

        // Dynamically import vanta and three.js only on client side
        const loadVanta = async () => {
            try {
                const THREE = await import("three");
                let VANTA;

                // Load different effects based on parameter
                switch (effect) {
                    case "waves":
                        VANTA = await import("vanta/dist/vanta.waves.min.js");
                        break;
                    case "fog":
                        VANTA = await import("vanta/dist/vanta.fog.min.js");
                        break;
                    case "net":
                        VANTA = await import("vanta/dist/vanta.net.min.js");
                        break;
                    case "cells":
                        VANTA = await import("vanta/dist/vanta.cells.min.js");
                        break;
                    case "halo":
                        VANTA = await import("vanta/dist/vanta.halo.min.js");
                        break;
                    default:
                        VANTA = await import("vanta/dist/vanta.net.min.js");
                }

                if (vantaRef.current && !vantaEffect.current) {
                    vantaEffect.current = (VANTA as any).default({
                        el: vantaRef.current,
                        THREE: THREE,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        scale: 1.0,
                        scaleMobile: 1.0,
                        color: 0xff0600,
                        backgroundColor: 0x23153c,
                    });
                }
            } catch (error) {
                console.error("Error loading Vanta.js:", error);
            }
        };

        loadVanta();

        // Handle window resize to make Vanta responsive
        const handleResize = () => {
            if (vantaEffect.current && vantaRef.current) {
                vantaEffect.current.resize();
            }
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };
    }, [effect]);

    return vantaRef;
};
