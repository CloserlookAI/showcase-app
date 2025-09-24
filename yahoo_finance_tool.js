#!/usr/bin/env node
const yahooFinance = require('yahoo-finance2').default;
const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .requiredOption('--symbol <symbol>', 'Stock symbol (e.g., LWAY)')
  .requiredOption('--type <type>', 'Type of data: quote|financials|news|market-research|competitors|analysis')
  .option('--limit <limit>', 'Limit for results', '10')
  .option('--save <file>', 'Save to file')
  .parse();

const options = program.opts();

async function getQuote(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      symbol: symbol,
      companyName: quote.shortName || quote.longName || symbol,
      currentPrice: quote.regularMarketPrice,
      marketCap: quote.marketCap,
      peRatio: quote.trailingPE,
      sector: quote.sector,
      industry: quote.industry,
      employees: quote.fullTimeEmployees,
      summary: quote.longBusinessSummary
    };
  } catch (error) {
    return { error: error.message, symbol };
  }
}

async function getFinancials(symbol) {
  try {
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: ['financialData', 'defaultKeyStatistics', 'summaryProfile']
    });

    return {
      symbol: symbol,
      revenue: summary.financialData?.totalRevenue,
      grossProfit: summary.financialData?.grossProfits,
      netIncome: summary.financialData?.netIncomeToCommon,
      totalAssets: summary.financialData?.totalAssets,
      totalDebt: summary.financialData?.totalDebt,
      shareholderEquity: summary.financialData?.totalStockholderEquity,
      grossMargin: summary.financialData?.grossMargins,
      operatingMargin: summary.financialData?.operatingMargins,
      profitMargin: summary.financialData?.profitMargins,
      returnOnEquity: summary.financialData?.returnOnEquity,
      currentRatio: summary.financialData?.currentRatio
    };
  } catch (error) {
    return { error: error.message, symbol };
  }
}

async function getNews(symbol, limit) {
  try {
    const search = await yahooFinance.search(symbol, {
      newsCount: parseInt(limit),
      quotesCount: 0
    });

    const processedNews = (search.news || []).map(article => ({
      title: article.title || '',
      publisher: article.publisher || '',
      publishTime: article.providerPublishTime ? new Date(article.providerPublishTime * 1000).toISOString() : null,
      link: article.link || '',
      summary: article.summary || ''
    }));

    return { symbol, news: processedNews };
  } catch (error) {
    return { error: error.message, symbol };
  }
}

async function getMarketResearch(symbol) {
  try {
    const [quote, summary] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance.quoteSummary(symbol, {
        modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics']
      })
    ]);

    return {
      symbol: symbol,
      companyProfile: {
        name: quote.shortName || quote.longName || symbol,
        sector: quote.sector,
        industry: quote.industry,
        employees: quote.fullTimeEmployees,
        website: summary.summaryProfile?.website,
        summary: summary.summaryProfile?.longBusinessSummary || ''
      },
      marketMetrics: {
        marketCap: quote.marketCap,
        enterpriseValue: summary.defaultKeyStatistics?.enterpriseValue,
        peRatio: quote.trailingPE,
        forwardPE: quote.forwardPE,
        priceToSales: summary.defaultKeyStatistics?.priceToSalesTrailing12Months,
        priceToBook: quote.priceToBook
      },
      technicalData: {
        currentPrice: quote.regularMarketPrice,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
        averageVolume: quote.averageVolume,
        beta: summary.defaultKeyStatistics?.beta
      }
    };
  } catch (error) {
    return { error: error.message, symbol };
  }
}

async function comprehensiveAnalysis(symbol) {
  try {
    const [quote, financials, marketResearch, news] = await Promise.all([
      getQuote(symbol),
      getFinancials(symbol),
      getMarketResearch(symbol),
      getNews(symbol, 5)
    ]);

    return {
      symbol: symbol,
      analysisType: 'comprehensive',
      quote,
      financials,
      marketResearch,
      recentNews: news,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return { error: error.message, symbol };
  }
}

async function main() {
  let result;

  try {
    // Suppress notices if method exists
    if (typeof yahooFinance.suppressNotices === 'function') {
      yahooFinance.suppressNotices(['yahooSurvey']);
    }

    switch (options.type) {
      case 'quote':
        result = await getQuote(options.symbol);
        break;
      case 'financials':
        result = await getFinancials(options.symbol);
        break;
      case 'news':
        result = await getNews(options.symbol, options.limit);
        break;
      case 'market-research':
        result = await getMarketResearch(options.symbol);
        break;
      case 'analysis':
        result = await comprehensiveAnalysis(options.symbol);
        break;
      default:
        result = { error: 'Invalid type specified' };
    }
  } catch (error) {
    result = { error: error.message };
  }

  if (options.save) {
    fs.writeFileSync(options.save, JSON.stringify(result, null, 2));
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);