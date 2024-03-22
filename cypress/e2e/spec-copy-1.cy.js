describe('Extract Table Data', () => {
  it('should extract data from all pages', () => {
    // Array to store the extracted row data
    const allRowData = [];

    // Visit the URL
    cy.visit('https://www.nepalstock.com/today-price');

    // Function to extract data from the current page
    const extractPageData = () => {
      // Array to store the row data from the current page
      const pageRowData = [];

      // Wait for the table to be available
      cy.get('table').should('be.visible');

      // Extract table data from the current page
      cy.get('table tbody tr').each(($row) => {
        const rowData = {};

        // Extract cell data from each row
        cy.wrap($row)
          .find('td')
          .each(($cell, index) => {
            // Assign the cell data to the corresponding property in the rowData object
            switch (index) {
              case 0:
                rowData.sn = $cell.text().trim();
                break;
              case 1:
                rowData.symbol = $cell.text().trim();
                break;
              case 2:
                rowData.closePrice = $cell.text().trim();
                break;
              case 3:
                rowData.openPrice = $cell.text().trim();
                break;
              case 4:
                rowData.highPrice = $cell.text().trim();
                break;
              case 5:
                rowData.lowPrice = $cell.text().trim();
                break;
              case 6:
                rowData.tradedQuantity = $cell.text().trim();
                break;
              case 7:
                rowData.tradedValue = $cell.text().trim();
                break;
              case 8:
                rowData.trades = $cell.text().trim();
                break;
              case 9:
                rowData.ltp = $cell.text().trim();
                break;
              case 10:
                rowData.previousClosePrice = $cell.text().trim();
                break;
              case 11:
                rowData.averageTradedPrice = $cell.text().trim();
                break;
              case 12:
                rowData.week52High = $cell.text().trim();
                break;
              case 13:
                rowData.week52Low = $cell.text().trim();
                break;
              case 14:
                rowData.marketCapitalization = $cell.text().trim();
                break;
            }
          })
          .then(() => {
            // Add the rowData object to the pageRowData array
            pageRowData.push(rowData);
          });
      });

      // Add the pageRowData to the allRowData array
      cy.then(() => {
        allRowData.push(...pageRowData);
      });
    };

    // Function to navigate to the next page
    const navigateToNextPage = (currentPage) => {
      cy.get('.pagination_ngx .ngx-pagination li:not(.pagination-previous):not(.pagination-next)').then(($pageLinks) => {
        const totalPages = $pageLinks.length;

        if (currentPage <= totalPages) {
          cy.wrap($pageLinks).eq(currentPage - 1).click();
          extractPageData();
          navigateToNextPage(currentPage + 1);
        } else {
          cy.log('All pages have been processed.');
          cy.log(JSON.stringify(allRowData, null, 2));
          cy.request('POST', 'http://localhost:3000/api/stock-data', allRowData)
  .then((response) => {
    expect(response.status).to.eq(200);
    cy.log('Data sent to the server successfully');
  });
          // You can perform further actions with the allRowData array here
        }
      });
    };

    // Start extracting data from the first page
    extractPageData();
    navigateToNextPage(2);
  });
});