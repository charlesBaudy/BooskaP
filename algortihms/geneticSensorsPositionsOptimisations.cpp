// C++ program to optimise number and position of sensors in electrical grid
// using Genetic Algorithm
#include <bits/stdc++.h>
#include "shortestPathDjikstra.cpp"

using namespace std;

// Number of individuals to evaluate in each generation
// The individual will represent: numberOfSensors, and position of those sensors in the Path (represented by bits)
#define POPULATION_SIZE 100

// Max number of sensors, corresponding to the total number of electric pylon
#define ELECTRIC_PYLON 9

// Maximum path length (all path added)
#define PATH_LENGTH 93

// Valid Genes are int going from (0 0000 0001)b2 to (1 1111 1111)b2  -- (1 - 511)
// const int VALID_GENES = randomNum(1, 511); // ex: 1 0000 0001 => 2 sensors | one in pos 0, one in pos 8
vector<vector<int>> adjacencyMatrix = {
    {0, 4, 0, 0, 0, 0, 0, 8, 0}, // ex : here, node[0] have a 4 weight path toward [1] / and 8 weight path toward [7]
    {4, 0, 8, 0, 0, 0, 0, 11, 0},
    {0, 8, 0, 7, 0, 4, 0, 0, 2},
    {0, 0, 7, 0, 9, 14, 0, 0, 0},
    {0, 0, 0, 9, 0, 10, 0, 0, 0},
    {0, 0, 4, 0, 10, 0, 2, 0, 0},
    {0, 0, 0, 14, 0, 2, 0, 1, 6},
    {8, 11, 0, 0, 0, 0, 1, 0, 7},
    {0, 0, 2, 0, 0, 0, 6, 7, 0}};

// Function to generate random numbers in the given range
int randomNum(int start, int end)
{
    int range = (end - start) + 1;
    int random_int = start + (rand() % range);
    return random_int;
}

// Function to get no of set bits in binary representation unsigned integer n
unsigned int countSetBits(unsigned int n)
{
    unsigned int count = 0;
    while (n)
    {
        count += n & 1;
        n >>= 1;
    }
    return count;
}

// Function to check if bit in K position is set in binary representation n
unsigned int isBitKSet(unsigned int n, int k)
{
    bool isSet;
    if (n & (1 << k))
    {
        isSet = true;
        // cout << k << "is set";
    }
    else
    {
        isSet = false;
        // cout << k << "is not set";
    }

    return isSet;
}

// Return position(s) of set bit in a binary as vector <int>
vector<int> sensorsPosition(unsigned int n)
{
    vector<int> positionList;
    for (int i = 0; i < 9; i++)
    {
        if (isBitKSet(n, i))
        {
            positionList.push_back(i);
        }
    }
    return positionList;
}

// Calculate "fitness" score of an individual, the lower the better
int evalueFitness(int numberOfSensor, vector<int> positionList, vector<vector<int>> adjacencyMatrix)
{
    // find the dist needed to go from the differents sources sensors to others nodes
    // ==> the lowest, the best
    int reponse = 0;
    int ILD = numberOfSensor;

    // to find reponse, for each sensor :
    // find the length between: current sensors & every other node =>
    // the "better" the position, the lower the average length will be
    for (int i = 0; i < positionList.size(); i++)
    {
        reponse = reponse + dijkstra(adjacencyMatrix, positionList[i]);
    }

    // Decided that the ideal number of sensor in theory is MAX_NODEs / 3; punish if lower or higher
    // give weight to value depending on definition of "good sensors positions" : 
    // as litte sensor as possibe with more sensors lowering response time
    if (numberOfSensor < (ELECTRIC_PYLON / 3))
    {
        ILD = (10 + numberOfSensor) * 5;
        reponse = reponse * 3;// response will be worse with less sensors
    }

    if (numberOfSensor == (ELECTRIC_PYLON / 3))
    {
        ILD = numberOfSensor * 5;
    }

    if (numberOfSensor > (ELECTRIC_PYLON / 3))
    {
        ILD = numberOfSensor * 15;
        reponse = reponse /2;// response will be better with more sensors
    }


    // calculate the fitness score as :
    int fitness = 2 * ((reponse * ILD) / (reponse + ILD));

    return fitness;
};

// Class representing an individual in population
class Individual
{
public:
    int genes;         // random number which represents positions AND number of sensors
    int numberSensors; // found from number of "1" in the genes bits

    char position[9]; 
    vector<int> positionList;

    int fitness;
    // fitness : the closer to 0, the better; evaluate the value of the current solution and choose which must be kept

    // Constructors
    Individual();
    Individual(int choosenNumber);

    // Create a third individual from two parents to create diversity close to previous solutions
    Individual mate(Individual parent2);
};

Individual::Individual()
{
    int randomGene = randomNum(1, 511);

    this->genes = randomGene;
    this->numberSensors = countSetBits(randomGene);
    this->positionList = sensorsPosition(randomGene);
    this->fitness = evalueFitness(this->numberSensors, this->positionList, adjacencyMatrix);

    itoa(randomGene, this->position, 2);
};

Individual::Individual(int choosenNumber)
{
    int randomGene = choosenNumber;

    this->genes = randomGene;
    this->numberSensors = countSetBits(randomGene);
    this->positionList = sensorsPosition(randomGene);
    this->fitness = evalueFitness(this->numberSensors, this->positionList, adjacencyMatrix);

    itoa(randomGene, this->position, 2);
};

// Perform mating and produce new offspring
// Return the new "offspring" individual using the value of the "parents"
Individual Individual::mate(Individual par2)
{
    int randomMutation = randomNum(1, 511);
    int offspringValue = (this->genes + par2.genes + randomMutation) / 3;

    // random probability
    float probability = randomNum(0, 100) / 100;

    // if prob is less than 0.45, insert gene from parent 1
    if (probability < 0.45)
        offspringValue = this->genes;

    // if prob is between 0.45 and 0.90, insert gene from parent 2
    else if (probability < 0.90)
    {
        offspringValue = par2.genes;
    }

    // otherwise insert random gene(mutate), in order to maintain diversity
    else
    {
        offspringValue = randomMutation;
    }

    // create new Individual(offspring) using generated genes for offspring
    return Individual(offspringValue);
};

// Overloading < operator
bool operator<(const Individual &ind1, const Individual &ind2)
{
    // Overloading the individual
    return ind1.fitness < ind2.fitness;
}

// Driver code
int main()
{
    // current time used to generate new random values
    srand((unsigned)(time(0)));

    // current generation
    int generation = 0;

    // Vector which contains every random draw of genes to evaluate
    vector<Individual> population;

    // create initial population
    for (int i = 0; i < POPULATION_SIZE; i++)
    {
        population.push_back(Individual());
    }

    for (int i = 0; i < 10; i++)
    {
        population.push_back(Individual());
        //    while (!found || counter <= 30)
        //    {
        
        // sort the population in increasing order of fitness score
        sort(population.begin(), population.end());

        // if the individual having lowest fitness score ie.
        // 10 then we know that we have reached to the target
        // and break the loop
        if (population[0].fitness <= 7)
        {
            break;
        }

        // Otherwise generate new offsprings for new generation
        vector<Individual> new_generation;

        // Perform Elitism, that mean 10% of fittest population
        // goes to the next generation
        int s = (10 * POPULATION_SIZE) / 100;
        for (int i = 0; i < s; i++)
        {
            new_generation.push_back(population[i]);
        }

        // From 50% of fittest population, Individuals
        // will mate to produce offspring
        s = (90 * POPULATION_SIZE) / 100;
        for (int i = 0; i < s; i++)
        {
            // Choose 2 parents randomly
            int r1 = randomNum(0, 50);
            int r2 = randomNum(0, 50);
            Individual parent1 = population[r1];
            Individual parent2 = population[r2];

            // Create "offspring" from mutation of parent1 and parent2
            Individual offspring = parent1.mate(parent2);
            new_generation.push_back(offspring);
        }

        population = new_generation;
        // Print infos
        cout << "\nGeneration: " << generation << "\t";
        cout << "\nNumber: " << population[0].genes;
        cout << "\nPosition: " << population[0].position;
        cout << "\nNumber of sensors: " << population[0].numberSensors;
        cout << "\nSensors are in :";
        for (int i = 0; i < population[0].numberSensors; i++)
        {
            cout << " " << population[0].positionList[i];
        }
        cout << "\nFitness: " << population[0].fitness << "\n";

        generation++;
    }

    cout << "\nGeneration: " << generation << "\t";
    // Print infos
    cout << "\nNumber: " << population[0].genes;
    cout << "\nPosition: " << population[0].position;
    cout << "\nNumber of sensors: " << population[0].numberSensors;
    cout << "\nSensors are in :";
    for (int i = 0; i < population[0].numberSensors; i++)
    {
        cout << " " << population[0].positionList[i];
    }
    cout << "\nFitness: " << population[0].fitness << "\n";
    
}
