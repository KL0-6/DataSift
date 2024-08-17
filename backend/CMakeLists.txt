cmake_minimum_required(VERSION 3.14)

project(DataSift)

set(CMAKE_CXX_STANDARD 20)

include(cmake/CPM.cmake)

add_executable(DataSift
    main.cpp
)