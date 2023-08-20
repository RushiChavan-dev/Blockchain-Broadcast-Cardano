import React, { useState } from "react";
import "./Carousel.css";

export const CarouselItem = ({ children, width }) => {
    return (
        <div className="carousel-item" style={{ width: width }}>
            {children}
        </div>
    );
};

const Carousel = ({ children, handleUpdateIndexCallback, offset, totalLength, auto, slides }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = slides || React.Children;

    const nextIndex = () => {
        let newIndex;
        if (activeIndex >= totalLength - offset) {
            newIndex = 0;
        }
        else {
            newIndex = activeIndex + 1;
        }
        setActiveIndex(newIndex);
        handleUpdateIndexCallback(newIndex);

    };

    const prevIndex = () => {
        let newIndex;
        if (activeIndex === 0) {
            newIndex = 0;
        }
        else {
            newIndex = activeIndex - 1;
        }
        setActiveIndex(newIndex);
        handleUpdateIndexCallback(newIndex);
    };

    return (
        <div className="carousel-container">
            {
                (totalLength > offset || activeIndex !== 0) &&
                <i className="fa-solid fa fa-chevron-left fa-lg indicator"
                    disabled={activeIndex === 0}
                    onClick={prevIndex}></i>
            }
            <div className={`carousel ${auto && "auto-scroll"}`}>
                <div
                    className={`inner ${auto && "auto-scroll-inner"}`}
                    style={{ transform: `translateX(-${(activeIndex) * 100 / offset}%)` }}>
                    {!auto ?
                        <div className={`${auto && "half-scroll"}`}>
                            {items.map(children, (child) => {
                                return React.cloneElement(child, {
                                    width: "100%"
                                });
                            })
                            }
                        </div> :
                        <>
                            <div className="half-scroll">
                                {items.map(item => {
                                    return item;
                                })
                                }
                            </div>
                            <div className="half-scroll">
                                {items.map(item => {
                                    return item;
                                })
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
            {
                ((totalLength > offset) || (activeIndex < totalLength - offset)) &&
                <i className="fa-solid fa fa-chevron-right fa-lg indicator"
                    disabled={activeIndex >= totalLength - offset}
                    onClick={nextIndex}>
                </i>
            }
        </div>
    );
};


export default Carousel;
