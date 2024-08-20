import {MetricsService} from '../src/index';

describe('MetricsService', () => {

    test('must set static labels', async () => {
        MetricsService.setStaticLabels({foo: 'bar'});
        MetricsService.counter('test').inc();

        const prom = await MetricsService.toPrometheus();
        expect(prom).toContain('foo');
    });

});
