import React from "react";
import { BoxContainer } from "./Box.styles";
import Item from "../item";

const Box = ({ box, originalBox }) => (
    <BoxContainer>
        {box.map((item, index) => (
            <Item key={index} value={item} original={originalBox[index]} />
        ))}
    </BoxContainer>
);

export default Box;
