const expect = require('chai').expect;
const requestParser = require('../src/requestParser');

describe('parseResizeRequest', () => {
    it('without query parameters', () => {
        const path = '/resize/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg'
        };
        
        const request = requestParser.parseResizeRequest(path);

        expect(request).to.be.eql(expectedRequest);
    });

    it('without query parameters and outputFormat', () => {
        const path = '/resize/Zm9vL2Jhci5qcGc=_300x200';
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: null
        };
        
        const request = requestParser.parseResizeRequest(path);

        expect(request).to.be.eql(expectedRequest);
    });

    // Error tests
    it('fail without height', () => {
        const path = '/resize/Zm9vL2Jhci5qcGc=_300x';
        const request = requestParser.parseResizeRequest(path);

        expect(request).to.be.null;
    });

    it('fail without width', () => {
        const path = '/resize/Zm9vL2Jhci5qcGc=_x300';
        const request = requestParser.parseResizeRequest(path);

        expect(request).to.be.null;
    });

    it('fail without fileName', () => {
        const path = '/resize/_300x200';
        const request = requestParser.parseResizeRequest(path);

        expect(request).to.be.null;
    });
});