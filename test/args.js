const expect = require('chai').expect;
const argsParser = require('../src/args');

describe('args.parse', () => {
    it('empty parameters', () => {
        const argv = ['node', 'foo.js'];
        const expectedArguments = {};

        const parsedArguments = argsParser.parse(argv);

        expect(parsedArguments).to.be.eql(expectedArguments);
    });

    it('long parameter name (no value)', () => {
        const argv = ['node', 'foo.js', '--foo'];
        const expectedArguments = {
            foo: true
        };

        const parsedArguments = argsParser.parse(argv);

        expect(parsedArguments).to.be.eql(expectedArguments);
    });

    it('long parameter name (with value)', () => {
        const argv = ['node', 'foo.js', '--foo=bar'];
        const expectedArguments = {
            foo: 'bar'
        };

        const parsedArguments = argsParser.parse(argv);

        expect(parsedArguments).to.be.eql(expectedArguments);
    });

    it('long parameter name (multiple ones)', () => {
        const argv = ['node', 'foo.js', '--foo', '--bar'];
        const expectedArguments = {
            foo: true,
            bar: true
        };

        const parsedArguments = argsParser.parse(argv);

        expect(parsedArguments).to.be.eql(expectedArguments);
    });
});
