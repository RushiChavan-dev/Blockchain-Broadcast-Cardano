import "./Accordion.css";
import React, { useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const Accordion = ({ data, screen, closeAccordion, handleOpenAccordionCallback }) => {
    const [clicked, setClicked] = useState(false);

    const toggle = index => {

        if (clicked === index) {
            return setClicked(null);
        }
        if (screen === "browser") { handleOpenAccordionCallback(); }
        setClicked(index);


    };

    return (<div className={`${screen === "browser" ? "accordion_section_browser" : "accordion_section"}`}>
        <div className={`${screen === "browser" && "accordion_container_browser"}`}>
            {data.map((item, index) => {
                return (
                    <div key={index}>
                        <div
                            className={`accordion_wrap ${screen === "browser" && "accordion_wrap_browser"}`}
                            onClick={() => toggle(index)}
                            key={index}>
                            <div className={`accordion_header ${screen === "browser" ? "accordion_header_browser" : "accordion_header_book"} ${item.type === "sort" && "sort_header"}`}>
                                {item.heading}
                            </div>
                            <div className={`${screen === "browser" && "accordion_expand_browser"}`}>
                                {clicked === index ?
                                    <ExpandLessIcon />
                                    :
                                    <ExpandMoreIcon />
                                }
                            </div>
                        </div>
                        {
                            (clicked === index && screen !== "browser") &&
                            <div className="accordion_dropdown accordion_dropdown_book">
                                {item.content}
                            </div>
                        }
                    </div>
                );
            })
            }

        </div>
        {
            (screen === "browser" && clicked !== false && clicked !== null && !closeAccordion) ?
                (<div className='accordion_dropdown'>
                    {(data || {})[clicked || 0].content}
                </div>) : null
        }
    </div>
    );
};

export default Accordion;
