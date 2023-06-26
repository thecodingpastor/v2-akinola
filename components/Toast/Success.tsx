import classes from "./Success.module.scss";

const Success = () => {
  return (
    <div className={classes.UISuccess}>
      <svg
        viewBox="0 0 87 87"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Group-3" transform="translate(2.000000, 2.000000)">
            <circle
              stroke=" #1d3041"
              strokeWidth="4"
              cx="41.5"
              cy="41.5"
              r="41.5"
            ></circle>
            <circle
              className={classes.UISuccess_circle}
              stroke="#1d304199"
              strokeWidth="4"
              cx="41.5"
              cy="41.5"
              r="41.5"
            ></circle>
            <polyline
              className={classes.UISuccess_path}
              stroke="#1d3041"
              strokeWidth="4"
              points="19 38.8036813 31.1020744 54.8046875 63.299221 28"
            ></polyline>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Success;
