# Proxy Observe

A Proxy based implementation of the now dead Object.observe feature initally planned for EcmaScript 2015.

## Description

The Object.observe() method was used for asynchronously observing the changes to an object. It provided a stream of changes in the order in which they occur. However, this API has been deprecated and removed from browsers.

This project provides a Proxy based implementation of the feature, being as close as possible to the original specification.

