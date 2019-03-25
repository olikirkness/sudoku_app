import styled from "styled-components";

const INPUT_DIM = "51vmin";

export const SolverWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    background: #f7cb15;
`;

export const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const GridWrapper = styled.div`
    height: ${INPUT_DIM};
    width: ${INPUT_DIM};
    margin: 10px;
    background: white;
    outline: 2px solid black;
    display: flex;
    flex-wrap: wrap;
`;

export const InputImage = styled.img`
    height: ${INPUT_DIM};
    width: ${INPUT_DIM};
    margin: 10px;
    outline: 2px solid black;
`;

export const ToolsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Label = styled.div`
    width: max-content;
    background: #090c08;
    color: #ffffff;
    text-align: center;
    font-size: 20px;
    padding: 5px 20px;
    margin: 10px;
    border-radius: 3px;
`;

export const Button = styled.div`
    width: max-content;
    background: #4ecdc4;
    color: #ffffff;
    text-align: center;
    font-size: 20px;
    padding: 8px 30px;
    margin: 10px;
    cursor: pointer;
    border-radius: 30px;
    border: 2px solid #4ecdc4;
    &:hover {
        border: 2px solid #090c08;
    }
`;
