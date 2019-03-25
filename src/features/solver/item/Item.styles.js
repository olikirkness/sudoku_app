import styled from "styled-components";

export const ItemContainer = styled.div`
    height: 5.66vmin;
    width: 5.66vmin;
    outline: 1px solid black;
    background: ${props => (props.isCalculated ? "#595758" : "#FFFFFF")};
    color: ${props => (props.isCalculated ? "#FFFFFF" : "#595758")};
    font-weight: bold;
    transition: background 300ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
`;
