class ApiError extends Error {
    constructor (name:string, message: string) {
        super()
        this.name = name
        this.message = message
    }
    toJSON():Object {
        return {name: this.name, message: this.message};
    }
}
export default ApiError