class Loader {
  async load() {
    try {
      if (this._wasm) {return;}
      /**
       * @private
       */
      this._wasm = await import("@emurgo/cardano-serialization-lib-browser/");
    } catch (error) {
      console.log("test")
    }

  }

  get Cardano() {
    try {
      return this._wasm;
    } catch (error) {
      console.log("work")
    }
   
  }
}

export default new Loader();