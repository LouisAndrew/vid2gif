// import React from 'react';
// import styling libs
// import local components

import { AppState } from '../../App';
import messages from './messages';

type Props = {
    /**
     * Current state of the app.
     */
    state: AppState;
};

/**
 * Text component at the top of the app
 * to show messages to the user according to the state of the app
 */
const Text: React.FC<Props> = ({ state }) => {
    const msg = messages[state]; // get the corresponding message.
    const { headerMsg, bodyMsg } = msg;

    return (
        <div className="mb-5">
            <h1 className="font-sans text-2xl font-bold text-gray-900 mb-2">
                {headerMsg}
            </h1>
            <p className="font-sans text-m font-normal text-gray-500">
                {bodyMsg}
            </p>
        </div>
    );
};

export { Text };
