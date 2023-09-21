/* eslint-disable */
export const mockDbConnection = () => {
    jest.mock('mysql2', () => ({
        createPool: jest.fn(),
    }));

    const mockConnection = {
        query: jest.fn(),
        end: jest.fn(),
    };

    // Provide a mock pool object when createPool is called
    const mysql2 = require('mysql2');
    mysql2.createPool.mockReturnValue({
        getConnection: jest.fn().mockResolvedValue(mockConnection),
    });
}
