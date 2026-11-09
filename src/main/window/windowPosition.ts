import { screen } from "electron"
import { windowManager } from "../WindowManager";

export function windowPosition() {
    const win = windowManager.window;
    if (!win) return;

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const [winWidth] = win!.getSize();

    const x = Math.round((width - winWidth) / 2);
    const y = Math.round(height / 3 - win!.getSize()[1] / 4);

    win!.setPosition(x, y);
}
