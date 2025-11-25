// react pure spinner component
import React from "react";

export default function OmeSpinner() {

    return (
        <div className="omespinner">
      <div className="svg_container">
        <svg className="rotating" viewBox="0 0 1024 896">
          <g>
            <path
              className="st0"
              d="M256,448c0,70.7-57.3,128-128,128S0,518.7,0,448s57.3-128,128-128S256,377.3,256,448z"
            />
          </g>
        </svg>
        <svg className="rotating" viewBox="0 0 1024 896">
          <g>
            <path
              className="st1"
              d="M448,128c0,70.7-57.3,128-128,128s-128-57.3-128-128S249.3,0,320,0S448,57.3,448,128z"
            />
          </g>
        </svg>
        <svg className="rotating" viewBox="0 0 1024 896">
          <g>
            <path
              className="st2"
              d="M832,128c0,70.7-57.3,128-128,128s-128-57.3-128-128S633.3,0,704,0S832,57.3,832,128z"
            />
          </g>
        </svg>
        <svg className="rotating" viewBox="0 0 1024 896">
          <g>
            <path
              className="st1"
              d="M1024,448c0,70.7-57.3,128-128,128s-128-57.3-128-128s57.3-128,128-128S1024,377.3,1024,448z"
            />
          </g>
        </svg>
        <svg className="rotating" viewBox="0 0 1024 896">
          <g>
            <path
              className="st3"
              d="M832,768c0,70.7-57.3,128-128,128s-128-57.3-128-128s57.3-128,128-128S832,697.3,832,768z"
            />
          </g>
        </svg>
        <svg className="rotating" viewBox="0 0 1024 896">
          <g>
            <path
              className="st1"
              d="M448,768c0,70.7-57.3,128-128,128s-128-57.3-128-128s57.3-128,128-128S448,697.3,448,768z"
            />
          </g>
        </svg>
      </div>
      <h1>Loading...</h1>
    </div>
    );
}
