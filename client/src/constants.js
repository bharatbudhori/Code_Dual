export const serverUrl = 'http://localhost:5000/';

export const tempCode = `#include <iostream>

using namespace std;

int main() {
    // Declare variables
    int size;

    // Prompt the user to enter the size of the array
    cin >> size;

    // Check if the size is non-positive
    if (size <= 0) {
        return 1; // Return 1 to indicate an error
    }

    // Declare an array of the given size
    int array[size];

    // Prompt the user to enter the elements of the array
    for (int i = 0; i < size; ++i) {
        cin >> array[i];
    }

    cout << "array elements are: " << endl;

    // Print the elements of the array
    for (int i = 0; i < size; ++i) {
        cout << " " << array[i];
    }


    // Return 0 to indicate successful execution
    return 0;
}
`