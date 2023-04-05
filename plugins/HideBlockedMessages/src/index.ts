import { FluxDispatcher } from '@vendetta/metro/common';
import { before } from "@vendetta/patcher"
import { findByProps } from "@vendetta/metro"
import { logger } from "@vendetta"

const RelationshipStore = findByProps("getRelationships", "isBlocked");
const FD = FluxDispatcher._actionHandlers._orderedActionHandlers;
const pluginName = "HideBlockedMessages";
  
function constructMessage(message, channel) {
    let msg = {
        id: '',
        type: 0,
        content: '',
        channel_id: channel.id,
        author: {
            id: '',
            username: '',
            avatar: '',
            discriminator: '',
            publicFlags: 0,
            avatarDecoration: null,
        },
        attachments: [],
        embeds: [],
        mentions: [],
        mention_roles: [],
        pinned: false,
        mention_everyone: false,
        tts: false,
        timestamp: '',
        edited_timestamp: null,
        flags: 0,
        components: [],
    };

    if (typeof message === 'string') msg.content = message;
    else msg = { ...msg, ...message };

    return msg;
};

// Function to check blocked users
const isBlocked = (id) => {
    return RelationshipStore.isBlocked(id);
};

let patches = [];
let attempt = 0;
const attempts = 3;

const delayedStart = () => {
    try {
        attempt++;
        logger.log(`${pluginName} Delayed start attempt ${attempt}/${attempts}.`);

        // Begin Patches
        const patch1 = (
            before("actionHandler", FD.LOAD_MESSAGES_SUCCESS?.find(i => i.name === "MessageStore"), (args: any) => {
                
                let messages = args[0].messages.filter((message) => { 
                    return (!isBlocked(message?.author?.id));
                });
                
                args[0].messages = messages;
            })
        );
        patches.push(patch1);

        const patch2 = (
            before("actionHandler", FD.MESSAGE_UPDATE?.find(i => i.name === "MessageStore"), (args: any) => {
                
                let message = args[0].message;
                
                if (isBlocked(message?.author?.id)) {
                    args[0].message = {};
                };
            })
        );
        patches.push(patch2);

        const patch3 = (
            before("actionHandler", FD.MESSAGE_CREATE?.find(i => i.name === "MessageStore"), (args: any) => {
                
                let message = args[0].message;
                
                if (isBlocked(message?.author?.id)) {
                    args[0].message = {};
                };
            })
        );
        patches.push(patch3);

        logger.log(`${pluginName} loaded.`);

        return null;
    } catch (err) {
        logger.log(`[${pluginName} Error]`, err);

        if (attempt < attempts) {
            console.warn(`${pluginName} failed to start. Trying again in ${attempt}0s.`);
            setTimeout(delayedStart, attempt * 10000);
        } else {
            console.error(`${pluginName} failed to start. Giving up.`);
        };
    };
}

// Load Plugin (begin first delayed start)
const onLoad = () => {
    logger.log(`Loading ${pluginName}...`);

    // Dispatch with a fake message to enable the action handlers from first loadup
    for (let type of ["MESSAGE_CREATE", "MESSAGE_UPDATE"]) {
        logger.log(`Dispatching ${type} to enable action handler.`);
        FluxDispatcher.dispatch({
            type: type,
            message: constructMessage('PLACEHOLDER', { id: '0' }),
        });
    };

    // Begin patch sequence
    setTimeout(() => delayedStart(), 300);
};

export default {
    onLoad,
    onUnload: () => {
        logger.log(`Unloading ${pluginName}...`);
        for (let unpatch of patches) {
            unpatch();
        };
        logger.log(`${pluginName} unloaded.`);
    }
};
