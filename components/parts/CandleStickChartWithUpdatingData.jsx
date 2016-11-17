"use strict";

import CandleStickChartWithMACDIndicator from "./CandleStickChartWithMACDIndicator";
import updatingDataWrapper from "./updatingDataWrapper";

var CandleStickChartWithUpdatingData = updatingDataWrapper(CandleStickChartWithMACDIndicator)

module.exports = CandleStickChartWithUpdatingData;
