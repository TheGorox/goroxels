class ChatMessage{
    static deserialize(obj){
        return new ChatMessage(obj.name, obj.message, obj.time ?? null, obj.isServer);
    }

    constructor(name, message, time, isServer){
        this.name = name;
        this.message = message;
        this.time = time;
        this.isServer = isServer;
    }

    serialize(){
        const props = {
            name: this.name,
            message: this.message,
            time: this.time,
            isServer: this.isServer,
        }

        return props;
    }
}

module.exports = ChatMessage