A set of metrics used for analyzing application state, based on [prometheus](https://prometheus.io/docs/concepts/metric_types/) metrics.



Counter
=======
```typescript
import {MetricsService} from 'app-metrics';


for (let i = 0; i < 100; i++) {
    MetricsService.counter('items_processed').inc();
}
```

Labels
======
```typescript
import {MetricsService} from 'app-metrics';

const conf = {};// read conf  
MetricsService.label('conf_value', conf.someValue)
```

Timers
======
```typescript
import {MetricsService} from 'app-metrics';

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
import {MetricsService} from 'app-metrics';

MetricsService.gauge('memory_external', () => process.memoryUsage().external);
MetricsService.gauge('memory_rss', () => process.memoryUsage().rss);
MetricsService.gauge('memory_heapTotal', () => process.memoryUsage().heapTotal);
MetricsService.gauge('memory_heapUsed', () => process.memoryUsage().heapUsed);
```

Histograms
======

```typescript
import {MetricsService} from 'app-metrics';
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
import {MetricsService} from 'app-metrics';

setInterval(async () => {
    console.log(await MetricsService.toConsole());
}, 60000);
```


Also you can have an endpoint to show metrics as json or in prometheus format:

```typescript
import {MetricsService} from 'app-metrics';
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
