function SvgAlertTriangleFill({ pathClassName, className, ...props }: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            style={{
                msTransform: 'rotate(360deg)',
                WebkitTransform: 'rotate(360deg)',
            }}
            transform="rotate(360)"
            className={className}
            {...props}
        >
            <path
                className={pathClassName}
                fill="#626262"
                d="M22.56 16.3L14.89 3.58a3.43 3.43 0 00-5.78 0L1.44 16.3a3 3 0 00-.05 3A3.37 3.37 0 004.33 21h15.34a3.37 3.37 0 002.94-1.66 3 3 0 00-.05-3.04zM12 17a1 1 0 111-1 1 1 0 01-1 1zm1-4a1 1 0 01-2 0V9a1 1 0 012 0z"
            />
            <path
                // className={pathClassName}
                fill="rgba(0, 0, 0, 0)"
                d="M0 0h24v24H0z"
            />
        </svg>
    );
}

export default SvgAlertTriangleFill;
