import styled from "styled-components";

import theme from "styles/theme";

export const TermTable = styled.table`
    background-color: transparent !important;
    margin-top: 0 !important;
    background-color: transparent;
    border-spacing: 0;
    margin-bottom: 16px;
    margin-top: 0;
    table-layout: fixed;
    width: 100%;
`;

export const TermTableBody = styled.tbody``;

export const TermTableRow = styled.tr``;


export const TermTableCell = styled.td`
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    color: ${theme.colors.primary};
    border-bottom: 1px solid ${theme.colors.opacExtraLighterGrey};
    padding: 1rem;

    &:first-child {
        width: 40px;
    }
`;

export const TermTableHeadCell = styled.th`
    background-color: transparent;
    color: ${theme.colors.primary};
    padding: 1rem;
    text-align: left;

    &:first-child {
        width: 40px;
    }
`;

export const TermTableHeader = styled.thead`
    background-color: transparent;
`;
