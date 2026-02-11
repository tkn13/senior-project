#include <iostream>
#include "Migrator.h"

int main() {
   
    if(migrate() == -1) {
        std::cerr << "Migration failed" << std::endl;
        return -1;
    }
    
    return 0;
}
