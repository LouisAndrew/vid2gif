const Archive = ({ topRef, isVideoIn, ...rest }: any) => {
    const fillColor = '#818CF8'; // tailwind-indigo-400
    const fillColorNoVideo = '#E5E7EB';

    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <g id="Group 1">
                <g id="icon">
                    <path
                        fill={isVideoIn ? fillColor : fillColorNoVideo}
                        id="container"
                        d="M2.85714 7.27273V12C2.85714 12.5523 3.30486 13 3.85714 13H8.42857H12.1429C12.6951 13 13.1429 12.5523 13.1429 12V7.27273"
                        stroke-width="0.25"
                    />
                    <path
                        ref={topRef}
                        id="top"
                        fill={isVideoIn ? fillColor : fillColorNoVideo}
                        d="M2 4V7.27273H14V4H2Z"
                        stroke-width="0.25"
                    />
                    <path
                        id="Line 3"
                        d="M6.28571 9.72727H8H9.71428"
                        stroke-width="0.25"
                        display={isVideoIn ? 'none' : 'block'}
                    />
                    <path
                        d="M8.5 10.7H8.04416V9.17188L7.5 9.31866V8.9963L8.45109 8.7H8.5V10.7Z"
                        stroke="transparent"
                        fill="#3730A3"
                        display={isVideoIn ? 'block' : 'none'}
                    />
                </g>
            </g>
        </svg>
    );
};

export default Archive;
