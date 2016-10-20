(function () {
  'use strict';
  /**
   * Latency testing based on httpRequests
   **/
  function latencyHttpTest(url, iterations, timeout, callbackComplete, callbackProgress, callbackAbort,
    callbackTimeout, callbackError) {
    this.url = url;
    this.iterations = iterations;
    this.timeout = timeout;
    this._test = null;
    this._testIndex = 0;
    this._results = [];
    //array holding active tests
    this._activeTests = [];
    //boolean on whether test  suite is running or not
    this._running = true;
    this.clientCallbackComplete = callbackComplete;
    this.clientCallbackProgress = callbackProgress;
    this.clientCallbackAbort = callbackAbort;
    this.clientCallbackTimeout = callbackTimeout;
    this.clientCallbackError = callbackError;

  };
  /**
  * Execute the request
  */
  latencyHttpTest.prototype.start = function () {
    var cachebuster = Date.now();
    this._test = new window.xmlHttpRequest('GET', [this.url, '?', cachebuster].join(''), this.timeout, this.onTestComplete.bind(this),
      this.onTestAbort.bind(this), this.onTestTimeout.bind(this), this.onTestError.bind(this));
    this._testIndex++;
    this._test.start(0, this._testIndex);
    this._activeTests.push({
      xhr: this._test,
      testRun: this._testIndex
    });
  };
  /**
  * onError method
  * @return abort object
  */
  latencyHttpTest.prototype.onTestError = function (result) {
    if(this._running){
      this.clientCallbackError(result);
    }
  };
  /**
  * onAbort method
  * @return abort object
  */
  latencyHttpTest.prototype.onTestAbort = function (result) {
    if(this._running){
      this.clientCallbackAbort(result);
    }
  };
  /**
  * onTimeout method
  * @return abort object
  */
  latencyHttpTest.prototype.onTestTimeout = function (result) {
    if(this._running){
      this.clientCallbackTimeout(result);
    }
  };
  /**
  * onComplete method
  * @return array of latencies
  */
  latencyHttpTest.prototype.onTestComplete = function (result) {
    if(!this._running){
      return;
    }
    this._results.push(result);
    this._activeTests.pop(result.id,1);
    this.clientCallbackProgress(result);
    if (this._testIndex !== this.iterations) {
      this.start();
    }
    else {
      this._running = false;
      this.clientCallbackComplete(this._results);
    }
  };

  /**
  * Cancel the test
  */
    latencyHttpTest.prototype.abortAll = function() {
      this._running = false;
      for(var i=0;i<this._activeTests.length;i++){
        debugger;
        if (typeof(this._activeTests[i])!== 'undefined') {
          this._activeTests[i].xhr._request.abort();
        }
      }
    }
    
  window.latencyHttpTest = latencyHttpTest;
})();
