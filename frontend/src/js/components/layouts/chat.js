import React from "react";
import PropTypes from "prop-types";
import {List, ListItem, Container, TextField} from "@material-ui/core";
import {ContainerBase} from "../../lib/component";

class Chat extends ContainerBase {
    constructor(props) {
        super(props);
        const {opSendMessage, sendMessage} = this.props;

        this._lastIndex = -1;
        this._sendMessage = (e) => {
            // console.log("In dom onclick method : ", this.props.opSendMessage);
            e.preventDefault();
            if (!this.props.opSendMessage.can) {
                return;
            }
            const message = this._text.value.trim();
            if (message.length == 0) {
                return;
            }

            sendMessage(message);
            this._text.value = "";
        };
    }

    static propTypes = {
        messages: PropTypes.array.isRequired,
        opSendMessage: PropTypes.object.isRequired,
        sendMessage: PropTypes.func.isRequired
    };

    componentDidUpdate() {
        const {messages} = this.props;
        if (messages.length == 0) {
            return;
        }
        const newIndex = messages[messages.length - 1].index;
        if (this._lastIndex == newIndex) {
            return;
        }
        this._messages.scrollTop = this._messages.scrollHeight;
        this._lastIndex = newIndex;

    }

    render() {
        const {messages, opSendMessage} = this.props;

        return (
            // style={{position: "absolute", bottom: "5%", width: "65%"}}
            <Container>
                <div>
                    <List ref={c => this._messages = c}>
                        {messages.map(message => {
                            return (
                                <ListItem key={message.index}>
                                    <span className="badge badge-dark mr-2">{message.name}</span> :
                                    <span className="ml-2">{message.message}</span>
                                </ListItem>
                            );
                        })}
                    </List>
                    <form onSubmit={this._sendMessage}>
                        <TextField
                            placeholder={opSendMessage.can ? "Enter a message" : "Please Login To Chat"}
                            inputRef={c => this._text = c}
                            disabled={!opSendMessage.can}
                            className="text-white"
                            fullWidth
                            InputProps={{
                                style: {
                                    color: "white"
                                }
                            }}
                        />
                    </form>
                </div>
            </Container>
        );
    }
}

// Chat.propTypes = {
//     messages: PropTypes.array.isRequired,
//     opSendMessage: PropTypes.object.isRequired,
//     sendMessage: PropTypes.func.isRequired
// };

export default Chat;