import React from 'react'
interface BorderProps {
    widthDimension: any;
    heightDimension: any;
    topDimension: any;
    leftDimension: any;
    cloneElement: any;
    deleteElement: any;
    greenBorder: any;
    redBorder: any;
    onMouseOut: any;
    setActive: any;
    borderStyle: any;
}

const Border: React.FC<BorderProps> = ({ borderStyle, setActive, widthDimension, heightDimension, topDimension, leftDimension, cloneElement, deleteElement, greenBorder, redBorder, onMouseOut }) => {
    return (
        <div
            id="buttonContainer"
            className="ic-select-box ic-select-box-can-delete buttonContainer"
            style={{
                width: widthDimension,
                height: heightDimension,
                top: 0,
                left: 0,
                transform: `translate3d(${topDimension}px, ${leftDimension}px, 0px)`,
                border: borderStyle
            }}
        >
            <div>
                <div className="control-container">
                    <a
                        className="select-duplicate"
                        href="#"
                        onClick={cloneElement}
                        onMouseOver={
                            greenBorder
                        }
                        onMouseOut={onMouseOut}
                    ></a>
                    <a
                        className="select-remove"
                        href="#"
                        onClick={deleteElement}
                        onMouseOver={
                            redBorder
                        }
                        onMouseOut={onMouseOut}
                    ></a>
                    <a
                        className="select-duplicate"
                        href="#"
                        onClick={setActive}
                        onMouseOver={
                            onMouseOut
                        }
                        onMouseOut={onMouseOut}
                    ></a>
                </div>
            </div>
        </div>
    )
}

export default Border
