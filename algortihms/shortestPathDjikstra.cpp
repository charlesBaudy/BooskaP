#include <bits/stdc++.h>
#include <chrono>
using namespace std;
using namespace std::chrono;

// Progam to find and print the shortest path between two random nodes in a weighted matrix (Djikstra)

// Function to print the shortest path from one node to another with associated distance (using "weight" )
void printPath(int currentNode, vector<int> parents)
{
    // Stop printing once there is no parent node
    if (currentNode < 0)
    {
        return;
    }
    printPath(parents[currentNode], parents); // Recursive print to go back to the previous node in "Path tree" until no more
    cout << currentNode << " ";
}

// Print the constructed array of path and the distances corresponding
void printSolution(int startVertex, vector<int> distances, vector<int> parents)
{
    int numberOfNodes = distances.size();
    cout << "Node path\t Distance\tPath";

    for (int vertexIndex = 0; vertexIndex < numberOfNodes;
         vertexIndex++)
    {
        if (vertexIndex != startVertex)
        {
            cout << "\n"
                 << startVertex << " -> ";
            cout << vertexIndex << " \t\t ";
            cout << distances[vertexIndex] << "\t\t";
            printPath(vertexIndex, parents);
        }
    }
}

// Djikstra algorithm for finding shortest path in a graph represented using "adjacency matrix"
int dijkstra(vector<vector<int>> adjacencyMatrix, int startVertex)
{
    int numberOfNodes = adjacencyMatrix[0].size();

    // shortestDistances[i] will hold the shortest distance from src to i
    vector<int> shortestDistances(numberOfNodes);

    // added[i] will be true if i is included / in shortest path tree
    // or shortest distance from src to i
    vector<bool> added(numberOfNodes);

    // Initialize all distances as
    // INFINITE and added[] as false
    for (int vertexIndex = 0; vertexIndex < numberOfNodes; vertexIndex++)
    {
        shortestDistances[vertexIndex] = INT_MAX;
        added[vertexIndex] = false;
    }

    // Distance of source vertex from itself is always 0
    shortestDistances[startVertex] = 0;

    // Parent array to store shortest path tree
    vector<int> parents(numberOfNodes);

    // The starting vertex does not have a parent
    parents[startVertex] = -1;

    // Find shortest path for all
    for (int i = 1; i < numberOfNodes; i++)
    {

        // Pick the minimum distance vertex from the set of vertices not yet
        // processed. nearestVertex is always equal to startNode in first iteration.
        int nearestVertex = -1;
        int shortestDistance = INT_MAX;
        for (int vertexIndex = 0; vertexIndex < numberOfNodes;
             vertexIndex++)
        {
            if (!added[vertexIndex] &&
                shortestDistances[vertexIndex] < shortestDistance)
            {
                nearestVertex = vertexIndex;
                shortestDistance = shortestDistances[vertexIndex];
            }
        }

        // Mark the picked vertex as processed
        added[nearestVertex] = true;

        // Update dist value of the adjacent vertices of the picked vertex.
        for (int vertexIndex = 0; vertexIndex < numberOfNodes; vertexIndex++)
        {
            int edgeDistance = adjacencyMatrix[nearestVertex][vertexIndex];

            if (edgeDistance > 0 && ((shortestDistance + edgeDistance) < shortestDistances[vertexIndex]))
            {
                parents[vertexIndex] = nearestVertex;
                shortestDistances[vertexIndex] = shortestDistance + edgeDistance;
            }
        }
    }

    // printSolution(startVertex, shortestDistances, parents);
    int averageDistance = 0;
    for (int i = 0; i < 8; i++)
    {
        averageDistance = averageDistance + shortestDistances[i];
    }

    return (averageDistance / 9);
}

/*
// Driver Code to print Djikstra
int main()
{
    auto start = high_resolution_clock::now(); // Start of timer to get execution time of function

    // Random example graph
    // Each { } is a node, number describing the "weight" of the path to each other
    vector<vector<int> > adjacencyMatrix = {
            { 0, 4, 0, 0, 0, 0, 0, 8, 0 },  //ex : here, node[0] have a 4 weight path toward [1] / and 8 weight path toward [7]
            { 4, 0, 8, 0, 0, 0, 0, 11, 0},
            { 0, 8, 0, 7, 0, 4, 0, 0, 2 },
            { 0, 0, 7, 0, 9, 14, 0, 0, 0 },
            { 0, 0, 0, 9, 0, 10, 0, 0, 0 },
            { 0, 0, 4, 0, 10, 0, 2, 0, 0 },
            { 0, 0, 0, 14, 0, 2, 0, 1, 6 },
            { 8, 11, 0, 0, 0, 0, 1, 0, 7 },
            { 0, 0, 2, 0, 0, 0, 6, 7, 0 }
            };

    //vector<int> distancesList = dijkstra(adjacencyMatrix, 3);
    int averageOfDistances = dijkstra(adjacencyMatrix, 3);


    auto stop = high_resolution_clock::now(); // End of timer to get execution time of function
    auto duration = duration_cast<milliseconds>(stop - start);

    cout << "\nTime of Djikstra function (in ms) " << duration.count()  << endl;

    cout << "Average of dist: " << averageOfDistances ;

    return 0;
}
*/