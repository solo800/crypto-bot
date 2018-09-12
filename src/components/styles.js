import styled from 'styled-components';

const AppCon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    
    > div {
        display: flex;
        flex-direction: column;
        max-width: 20%;
        
        > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0.5rem 0;
        }
        
        > button {
            margin-top: 0.4rem;
        }
    }
`;

export default AppCon;