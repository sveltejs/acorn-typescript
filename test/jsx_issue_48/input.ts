
import styled from 'styled-components';

type ExtendedProps = {
    $anyprop: string;
};

const StyledDiv = styled.div<ExtendedProps>`
    color: red;
`;
