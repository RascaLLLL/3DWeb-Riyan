import { playerConfig } from "@/data/player";
import { useGameStore } from "@/stores/game-store";
import { adjustCameraDistance, clearPlayerInput } from "@/systems/player/motion";
import type { PlayerRuntimeRef } from "@/types/player";
const movementKeys = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight"]);

export function isEditingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, button, a, [contenteditable='true'], [role='dialog']"));
}

export function bindPlayerInput(canvas: HTMLCanvasElement, runtime: PlayerRuntimeRef) {
    const state = runtime.current;
    const isBlocked = () => { const game = useGameStore.getState(); return game.gamePaused || game.activePanel !== null; };
    const clear = () => {
      const pointer = state.input.pointerId;
      clearPlayerInput(state);
      if (pointer >= 0 && canvas.hasPointerCapture(pointer)) canvas.releasePointerCapture(pointer);
    };
    const blur = () => { state.input.focused = false; clear(); state.state = "paused"; };
    const focus = () => { state.input.focused = document.activeElement === canvas; clear(); };
    const visibility = () => { if (document.hidden) blur(); else focus(); };
    const focusIn = (event: FocusEvent) => {
      state.input.focused = event.target === canvas;
      if (event.target !== canvas) clear();
    };
    const down = (event: KeyboardEvent) => {
      if (isEditingTarget(event.target) || event.ctrlKey || event.metaKey || event.altKey) return;
      if (document.activeElement !== canvas || !state.input.focused) return;
      if (event.code === "Escape" && !event.repeat && useGameStore.getState().activePanel === null) {
        event.preventDefault(); clear(); useGameStore.getState().setPaused(!useGameStore.getState().userPaused); return;
      }
      if (isBlocked()) return;
      if (movementKeys.has(event.code)) { event.preventDefault(); state.input.keys.add(event.code); }
      if (event.code === "KeyE" && !event.repeat) { event.preventDefault(); state.interactionRequested = true; }
    };
    const up = (event: KeyboardEvent) => { state.input.keys.delete(event.code); };
    const pointerDown = (event: PointerEvent) => {
      if (isBlocked() || event.button !== 0 || !event.isPrimary) return;
      canvas.focus({ preventScroll: true });
      state.input.focused = true;
      state.input.dragging = true; state.input.pointerId = event.pointerId;
      state.input.lastPointerX = event.clientX; state.input.lastPointerY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const pointerMove = (event: PointerEvent) => {
      if (!state.input.dragging || state.input.pointerId !== event.pointerId || isBlocked()) return;
      state.cameraYaw -= (event.clientX - state.input.lastPointerX) * playerConfig.camera.sensitivity;
      state.cameraPitch = Math.max(playerConfig.camera.minPitch, Math.min(playerConfig.camera.maxPitch,
        state.cameraPitch + (event.clientY - state.input.lastPointerY) * playerConfig.camera.sensitivity));
      state.input.lastPointerX = event.clientX; state.input.lastPointerY = event.clientY;
    };
    const pointerUp = (event: PointerEvent) => {
      if (event.pointerId !== state.input.pointerId) return;
      state.input.dragging = false; state.input.pointerId = -1;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    const wheel = (event: WheelEvent) => {
      if (isBlocked()) return;
      event.preventDefault();
      adjustCameraDistance(state, event.deltaY * .008);
    };
    const unsubscribe = useGameStore.subscribe((game, previous) => {
      if (game.gamePaused !== previous.gamePaused || game.activePanel !== previous.activePanel) {
        clear();
        if (game.gamePaused || game.activePanel !== null) state.state = "paused";
      }
    });
    canvas.setAttribute("tabindex", "0"); canvas.setAttribute("aria-label", "Village controls. WASD or arrows to walk, Shift to run, E to talk to a nearby villager or interact at an entrance, Escape to pause. Drag to rotate the camera.");
    state.input.focused = document.hasFocus() && document.activeElement === canvas;
    if (isBlocked()) state.state = "paused";
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    window.addEventListener("blur", blur); window.addEventListener("focus", focus);
    document.addEventListener("visibilitychange", visibility); document.addEventListener("focusin", focusIn);
    canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp); canvas.addEventListener("pointercancel", pointerUp);
    canvas.addEventListener("lostpointercapture", pointerUp); canvas.addEventListener("wheel", wheel, { passive: false });
    return () => {
      clear(); unsubscribe();
      window.removeEventListener("keydown", down); window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur); window.removeEventListener("focus", focus);
      document.removeEventListener("visibilitychange", visibility); document.removeEventListener("focusin", focusIn);
      canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp); canvas.removeEventListener("pointercancel", pointerUp);
      canvas.removeEventListener("lostpointercapture", pointerUp); canvas.removeEventListener("wheel", wheel);
    };
  }
