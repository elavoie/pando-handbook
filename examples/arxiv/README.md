# Collaborative Identification of Relevant Papers on Arxiv

Author: Erick Lavoie

This example shows how a group of people can collaboratively classify a stream
of entries from the Arxiv Website to identify relevant papers to their
research. The example combines one utility to retrieve the Arxiv entries using
their public API and a classification function that is based on human input.

The example demonstrates both how a processing function may dynamically create
interactive elements for visualization and interaction. It also shows how the
function may wait for human input before returning a result.

# Usage Example

````
npm install
````

The ````feed```` utility directly uses a URL following the Arxiv API format and
output each entry in a line-delimited JSON format:

````
./feed http://export.arxiv.org/api/query?search_query=all:javascript\&max_results=20 | pando classify.js --stdin
````
