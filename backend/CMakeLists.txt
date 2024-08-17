cmake_minimum_required(VERSION 3.14)

project(DataSift)

set(CMAKE_CXX_STANDARD 20)

include(cmake/CPM.cmake)

add_executable(DataSift
    main.cpp
)

CPMAddPackage(
    NAME drogon
    GITHUB_REPOSITORY drogonframework/drogon
    GIT_TAG origin/master
)

target_link_libraries(CFFBackend PRIVATE drogon)