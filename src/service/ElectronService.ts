export class ElectronService {
    public close() {
        window.application.close()
    }

    public minimize() {
        window.application.minimized()
    }

    public maximize() {
        window.application.maximize()
    }

    public minimizable() {
        window.application.minimizable()
    }

    public maximizable() {
        window.application.maximizable()

    }
    public isMaximizable() {
        return window.application.isMaximizable()
    }
}

const electronService = new ElectronService()

export default electronService
