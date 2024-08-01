class ApiError extends Error {
    status: number;

    constructor(status: number, name: string, message: string) {
        super()
        this.status = status
        this.name = name
        this.message = message
    }
    toJSON(): Object {
        return { name: this.name, message: this.message };
    }
}
export default ApiError