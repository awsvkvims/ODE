#==========================================================
# ODE Market State Engine
#
# Version : 0.1.0
# Issue   : ODE-001.1
#
# Component:
# Trend Persistence
#
# Measures how consistently price stays on one side
# of the 20 EMA over the lookback period.
#
# Score:
# 0 - 100
#==========================================================

input emaLength = 20;
input lookback = 20;

#----------------------------------------------------------
# EMA
#----------------------------------------------------------

def ema20 = ExpAverage(close, emaLength);

#----------------------------------------------------------
# Count bars above and below EMA
#----------------------------------------------------------

def aboveEMA = if close > ema20 then 1 else 0;

def aboveCount = Sum(aboveEMA, lookback);
def belowCount = lookback - aboveCount;

#----------------------------------------------------------
# Trend Persistence Score
#
# Highest percentage on either side of the EMA.
#
# Examples:
#
# 20 above / 0 below = 100
# 18 above / 2 below = 90
# 10 above /10 below = 50
#  2 above /18 below = 90
#----------------------------------------------------------

def trendPersistenceScore =
    Max(aboveCount, belowCount) / lookback * 100;

#----------------------------------------------------------
# Display
#----------------------------------------------------------

def bullBias = aboveCount > belowCount;

AddLabel(
    yes,
    "Bull Bars: " + aboveCount,
    Color.GREEN
);

AddLabel(
    yes,
    "Bear Bars: " + belowCount,
    Color.RED
);

AddLabel(
    yes,
    "Trend Persistence: " + Round(trendPersistenceScore, 0),
    Color.WHITE
);

AddLabel(
    yes,
    "Bias: " + (if bullBias then "BULL" else "BEAR"),
    if bullBias then Color.GREEN else Color.RED
);