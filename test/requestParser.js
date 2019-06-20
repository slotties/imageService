const expect = require('chai').expect;
const requestParser = require('../src/requestParser');

describe('parseResizeRequest', () => {
    it('without query parameters', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg'
        };
        
        const request = requestParser.parseResizeRequest(path, {});

        expect(request).to.be.eql(expectedRequest);
    });

    it('without query parameters and outputFormat', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200';
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: null
        };
        
        const request = requestParser.parseResizeRequest(path, {});

        expect(request).to.be.eql(expectedRequest);
    });

    it('with fill but no bg', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const queryParams = {
            fill: 'true'
        };
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg',
            fill: true,
            fillBackgroundColor: '#000'
        };
        
        const request = requestParser.parseResizeRequest(path, queryParams);

        expect(request).to.be.eql(expectedRequest);
    });

    it('with fill with bg (short hex code)', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const queryParams = {
            fill: 'true',
            bg: '012'
        };
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg',
            fill: true,
            fillBackgroundColor: '#012'
        };
        
        const request = requestParser.parseResizeRequest(path, queryParams);

        expect(request).to.be.eql(expectedRequest);
    });

    it('with fill with bg (long hex code)', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const queryParams = {
            fill: 'true',
            bg: '012345'
        };
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg',
            fill: true,
            fillBackgroundColor: '#012345'
        };
        
        const request = requestParser.parseResizeRequest(path, queryParams);

        expect(request).to.be.eql(expectedRequest);
    });

    it('with fill with bg (rgb)', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const queryParams = {
            fill: 'true',
            bg: '255,128,0'
        };
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg',
            fill: true,
            fillBackgroundColor: {
                alpha: 1,
                b: 0,
                g: 128,
                r: 255
            }
        };
        
        const request = requestParser.parseResizeRequest(path, queryParams);

        expect(request).to.be.eql(expectedRequest);
    });

    it('with fill with bg (rgba)', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const queryParams = {
            fill: 'true',
            bg: '255,128,0,0.5'
        };
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg',
            fill: true,
            fillBackgroundColor: {
                r: 255,
                g: 128,
                b: 0,
                alpha: 0.5
            }
        };
        
        const request = requestParser.parseResizeRequest(path, queryParams);

        expect(request).to.be.eql(expectedRequest);
    });

    // Error tests
    it('fail without height', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x';
        const request = requestParser.parseResizeRequest(path, {});

        expect(request).to.be.null;
    });

    it('fail without width', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_x300';
        const request = requestParser.parseResizeRequest(path, {});

        expect(request).to.be.null;
    });

    it('fail without fileName', () => {
        const path = '/resized/_300x200';
        const request = requestParser.parseResizeRequest(path, {});

        expect(request).to.be.null;
    });

    it('fail with invalid rgb hex code', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const queryParams = {
            fill: 'true',
            bg: '00gghh'
        };
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg',
            fill: true,
            fillBackgroundColor: '#000'
        };
        const request = requestParser.parseResizeRequest(path, queryParams);
        expect(request).to.be.eql(expectedRequest);
    });

    it('fail with invalid rgba code (red only)', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const queryParams = {
            fill: 'true',
            bg: '255'
        };
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg',
            fill: true,
            fillBackgroundColor: '#255'
        };
        const request = requestParser.parseResizeRequest(path, queryParams);
        expect(request).to.be.eql(expectedRequest);
    });
       
    it('fail with invalid rgba code (red-green only)', () => { 
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const queryParams = {
            fill: 'true',
            bg: '255,128'
        };
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg',
            fill: true,
            fillBackgroundColor: '#000'
        };
        const request = requestParser.parseResizeRequest(path, queryParams);
        expect(request).to.be.eql(expectedRequest);
    });
       
    it('fail with invalid rgba code (invalid blue)', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const queryParams = {
            fill: 'true',
            bg: '255,128,x'
        };
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg',
            fill: true,
            fillBackgroundColor: '#000'
        };
        const request = requestParser.parseResizeRequest(path, queryParams);
        expect(request).to.be.eql(expectedRequest);
    });
       
    it('fail with invalid rgba code (invalid alpha)', () => {
        const path = '/resized/Zm9vL2Jhci5qcGc=_300x200.jpg';
        const queryParams = {
            fill: 'true',
            bg: '255,128,0,x'
        };
        const expectedRequest = {
            width: 300,
            height: 200,
            fileName: 'foo/bar.jpg',
            outputFormat: 'jpg',
            fill: true,
            fillBackgroundColor: '#000'
        };
        const request = requestParser.parseResizeRequest(path, queryParams);
        expect(request).to.be.eql(expectedRequest);
    });
});
