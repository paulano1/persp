import React, { useState } from "react";
import { CSSProperties } from 'react';
export interface TokenGroupProps {
    tags : string[];
}

export const TokenGroup = ({tags}: TokenGroupProps) => {
    const [selectedTag, setSelectedTag] = useState('');

    const handleClick = (tag: string) => {
        setSelectedTag(tag);
    }

    return (
        <div className="TokenGroup-container">
            {tags.map((tag, index) => {
                const isSelected = tag === selectedTag;
                return (
                    <div
                        key={index}
                        className={`TokenGroup-tag ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleClick(tag)}
                    >
                        {tag}
                    </div>
                )
            })}
        </div>
    );
}