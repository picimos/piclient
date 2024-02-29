
import { Config, PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.2';
import { CloudrenderIns, CloudrenderOptions, DisconnectMsg } from './types'

// 
// WebServers\Frontend\implementations\EpicGames\src\uiless.ts
// https://github.com/EpicGames/PixelStreamingInfrastructure/tree/master/Frontend/implementations/EpicGames/src/uiless.ts

// lib-pixelstreamingfrontend-ue5.2\types\PixelStreaming\PixelStreaming.d.ts
/**
 * Send data to UE application. The data will be run through JSON.stringify() so e.g. strings
 * and any serializable plain JSON objects with no recurrence can be sent.
 * @returns true if succeeded, false if rejected
 */
//emitUIInteraction(descriptor: object | string): boolean;
/**
 * Send a command to UE application. Blocks ConsoleCommand descriptors unless UE
 * has signaled that it allows console commands.
 * @returns true if succeeded, false if rejected
 */
//emitCommand(descriptor: object): boolean;
/**
 * Send a console command to UE application. Only allowed if UE has signaled that it allows
 * console commands.
 * @returns true if succeeded, false if rejected
 */
//emitConsoleCommand(command: string): boolean;
/**
 * Add a UE -> browser response event listener
 * @param name - The name of the response handler
 * @param listener - The method to be activated when a message is received
 */
//addResponseEventListener(name: string, listener: (response: string) => void): void;

export async function useCloudrender(options: CloudrenderOptions) {

    const ins = {} as CloudrenderIns

    // const {
    //     address,
    //     appKey,
    //     $el = document.body,
    //     readyCB,
    //     disconnectCB,
    //     onProgress,
    //     report,
    // } = options

    const onReport = () => {
    }

    const disconnectFn = (msg: DisconnectMsg) => {
    }

    const init = async () => {
        try {
            // Create a config object
            const config = new Config({
                initialSettings: {
                    AutoPlayVideo: true,
                    AutoConnect: true,
                    ss: options.address,
                    StartVideoMuted: false,
                }
            });

            // Create a PixelStreaming instance and attach the video element to an existing parent div
            const pixelStreaming = new PixelStreaming(config, { videoElementParent: options.$el });
            pixelStreaming.play();
        } catch (err) {
            throw new Error('Faild to initialize cloudrender. ' + err)
        }
    }

    const destroy = () => {
    }

    ins.init = init
    ins.destroy = destroy

    return ins
}