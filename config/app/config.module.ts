import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {AppConfigService} from "./config.service";
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            validationSchema: Joi.object({
                APP_PORT: Joi.number().default(3333),
            }),
        }),
    ],
    providers: [ConfigService, AppConfigService],
    exports: [ConfigService, AppConfigService ],
})
export class AppConfigModule {}