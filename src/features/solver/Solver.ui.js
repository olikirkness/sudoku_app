import React, { Component } from "react";
import image1 from "../../assets/image_3.png";
import { handleFindNextSearch, tesseract } from "./Solver.helpers";
import {
    SolverWrapper,
    ContentWrapper,
    InputWrapper,
    InputImage,
    GridWrapper,
    ToolsContainer,
    Label,
    Button
} from "./Solver.styles";
import Box from "./box";

class Solver extends Component {
    state = {
        boxes: [...Array(9)].map(() => [...Array(9)]),
        original: [...Array(9)].map(() => [...Array(9)]),
        stop: false,
        error: null,
        start: null,
        end: null,
        image: image1
    };

    componentDidMount() {
        this.start();
    }

    start = () => {
        this.i = 0;

        const { original, image } = this.state;

        this.setState({ boxes: original, start: null, end: null, error: null });

        tesseract(image, this.handleOcrResults);
    };

    handleOcrResults = results => {
        this.setState({ ...results }, () => {
            this.handleIteration(0, 0, 1, results.boxes, null, 0);
        });
    };

    handleIteration = (boxIndex, itemIndex, testNumber, boxes, updatedMissingNums, i) => {
        let { stop, missingNums } = this.state;

        this.i = i;

        if (updatedMissingNums) {
            this.setState({
                missingNums: updatedMissingNums,
                boxes
            });

            missingNums = updatedMissingNums;
        }

        if (this.i < 2000) {
            handleFindNextSearch(
                boxIndex,
                itemIndex,
                testNumber,
                boxes,
                missingNums,
                stop,
                this.i,
                this.handleIteration,
                this.successCallback
            );
        } else {
            this.setState({
                error: "Too difficult :(",
                end: new Date()
            });
        }
    };

    successCallback = boxes => {
        this.setState({ boxes, end: new Date() });
    };

    i = 0;

    render() {
        const { boxes, original, start, end, error, image } = this.state;

        return (
            <SolverWrapper>
                <ContentWrapper>
                    <InputWrapper>
                        <Label>Input image</Label>
                        <InputImage src={image} />
                    </InputWrapper>
                    <InputWrapper>
                        <Label>Calculated output</Label>
                        <GridWrapper>
                            {boxes.map((box, index) => (
                                <Box key={index} box={box} originalBox={original[index]} />
                            ))}
                        </GridWrapper>
                    </InputWrapper>
                </ContentWrapper>
                <ToolsContainer>
                    <Label>ITERATIONS: {this.i}</Label>
                    <Label>TIME: {end ? Math.round(end.getTime() - start.getTime()) : 0}ms</Label>
                    {error ? <Label>{error}</Label> : null}
                </ToolsContainer>
                <ToolsContainer>{start && end ? <Button onClick={this.start}>RESTART</Button> : null}</ToolsContainer>
            </SolverWrapper>
        );
    }
}

export default Solver;
