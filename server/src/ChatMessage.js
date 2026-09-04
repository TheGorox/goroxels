let messageIdCounter = 0;

class ChatMessage{
    static deserialize(obj){
        let id = obj.id;

        // restore or generate message id
        if (id !== undefined && id !== null) {
            if (id >= messageIdCounter) {
                messageIdCounter = id + 1;
            }
        } else {
            id = messageIdCounter++;
        }

        return new ChatMessage(obj.name, obj.message, obj.time ?? null, obj.isServer, obj.replyingTo, id);
    }

    constructor(name, message, time, isServer, replyingTo=null, id=undefined){
        this.name = name;
        this.message = message;
        this.time = time;
        this.isServer = isServer;
        this.replyingTo = replyingTo;
        if(id === undefined){
            id = messageIdCounter++;
        }
        this.id = id;
    }

    serialize(){
        const props = {
            name: this.name,
            message: this.message,
            time: this.time,
            isServer: this.isServer,
            id: this.id,
            replyingTo: this.replyingTo
        }

        return props;
    }
}

module.exports = ChatMessage