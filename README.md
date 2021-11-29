A set of metrics used for analyzing application state, based on [prometheus](https://prometheus.io/docs/concepts/metric_types/) metrics.

Usage
=====
```
npm i application-metrics
```

Counter
=======
```typescript
import {MetricsService} from 'application-metrics';


for (let i = 0; i < 100; i++) {
    MetricsService.counter('items_processed').inc();
}
```

Labels
======
```typescript
import {MetricsService} from 'application-metrics';

const conf = {};// read conf  
MetricsService.label('conf_value', conf.someValue)
```

Timers
======
```typescript
import {MetricsService} from 'application-metrics';

function process(): void {
    for (let i = 0; i < 100; i++) {
        // do some stuff
    }
}

async function processAsync(): Promise<void> {
    for (let i = 0; i < 100; i++) {
        // do some stuff
    }
}

MetricsService.timer('process_ms').time(() => process());
MetricsService.timer('process_async_ms').time(() => processAsync());
```

or use `@Metric()` to observe the method:

```typescript
import {MetricsService} from 'application-metrics';

class EntriesDao {
    
    @Metric('saveEntries')
    async saveEntries(entries: object[]): Promise<void> {
        // ...
    }
}
```



Gauges
======
```typescript
import {MetricsService} from 'application-metrics';

MetricsService.gauge('memory_external', () => process.memoryUsage().external);
MetricsService.gauge('memory_rss', () => process.memoryUsage().rss);
MetricsService.gauge('memory_heapTotal', () => process.memoryUsage().heapTotal);
MetricsService.gauge('memory_heapUsed', () => process.memoryUsage().heapUsed);
```

Histograms
======

```typescript
import {MetricsService} from 'application-metrics';
import * as fs from 'fs';

const files = fs.readdirSync('.');
files.forEach(f => {
    MetricsService.histogram('file_size_bytes').observe(fs.statSync(f).size);
});

MetricsService.toConsole().then(msg => {
    console.log(msg);
});
```

outputs something like 
```
****** METRICS ******
Histograms:       
  file_size_bytes:  {"50":543,"90":11328,"95":300966,"99":397512,"count":15}
```



Output
======
You can periodically print metrics to console:
```typescript
import {MetricsService} from 'application-metrics';

MetricsService.gauge('memory_external', () => process.memoryUsage().external);
MetricsService.gauge('memory_rss', () => process.memoryUsage().rss);
MetricsService.gauge('memory_heapTotal', () => process.memoryUsage().heapTotal);
MetricsService.gauge('memory_heapUsed', () => process.memoryUsage().heapUsed);


setInterval(async () => {
    console.log(await MetricsService.toConsole());
}, 60000);
```
will produce something like:
```
 ****** METRICS ******
Gauges:                                                   
  memory_external:                           104,763,523
  memory_rss:                                440,160,256
  memory_heapTotal:                          255,873,024
  memory_heapUsed:                           229,729,176
```

Also, you can have an endpoint to show metrics as json or in prometheus format (example uses [NestJS](https://nestjs.com/)):

```typescript
import {MetricsService} from 'application-metrics';
import {Controller, Get, Header} from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiProduces,
    ApiTags,
} from '@nestjs/swagger';

@Controller()
@ApiTags('metrics')
export class MetricsController {
    
    @ApiOperation({
        description: 'Get metrics in json format',
        summary: 'Get metrics in json format',
    })
    @ApiOkResponse({description: 'Success', type: Object})
    @Get('metrics')
    @Header('Content-Type', 'application/json')
    async getMetrics(): Promise<string> {
        return JSON.stringify(await MetricsService.toJson(), null, 4);
    }

    
    @ApiOperation({
        description: 'prometheus metrics export endpoint',
        summary: 'Get metrics in prometheus format',
    })
    @ApiOkResponse({description: 'Success', type: String})
    @ApiProduces('text/plain')
    @Get('prometheusmetrics')
    @Header('Content-Type', 'text/plain')
    async getPrometheusMetrics(): Promise<string> {
        return MetricsService.toPrometheus();
    }
}
```
```shell
curl localhost:3000/metrics
```
```
{
    "gauges": {
        "memory_external": 17936815,
        "memory_rss": 291016704,
        "memory_heapTotal": 202420224,
        "memory_heapUsed": 180871624
    }
}
```



```shell
curl localhost:3000/prometheusmetrics
```
```
# HELP gauge_memory_external gauge_memory_external
# TYPE gauge_memory_external gauge
memory_external 85052806

# HELP gauge_memory_rss gauge_memory_rss
# TYPE gauge_memory_rss gauge
memory_rss 401350656

# HELP gauge_memory_heapTotal gauge_memory_heapTotal
# TYPE gauge_memory_heapTotal gauge
memory_heapTotal 224940032

# HELP gauge_memory_heapUsed gauge_memory_heapUsed
# TYPE gauge_memory_heapUsed gauge
memory_heapUsed 185016864
```
