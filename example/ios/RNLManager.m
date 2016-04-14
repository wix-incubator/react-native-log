//
//  RNLManager.m
//  example
//
//  Created by Tal Kol on 4/10/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RNLManager.h"
#import "RCTBridge.h"
#import "RCTJSCExecutor.h"
@import JavaScriptCore;

@implementation RNLManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
}

RCT_EXPORT_METHOD(setup)
{
  id<RCTJavaScriptExecutor> executor = [self.bridge valueForKey:@"javaScriptExecutor"];
  if ([executor isKindOfClass:[RCTJSCExecutor class]])
  {
    [executor addSynchronousHookWithName:@"loggerGetCaller" usingBlock:^(JSValue *val){
      JSValue *callee = [JSContext currentCallee];
      id obj = [callee toObject];
      val = [val valueForProperty:@"caller"];
      JSValue *num = [val valueForProperty:@"length"];
      NSLog(@"%@", num);
      return num;
    }];
  }
}

RCT_REMAP_METHOD(getCaller, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  //JSValue *callee = [JSContext currentCallee];
  resolve(@"hello");
  // NSError *error = [NSError new];
  // reject(@"no_events", @"There were no events", error);
  
}

@end