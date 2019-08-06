<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <div class="headline">Group 5A</div>
        </v-card-title>
        <v-card-text>
          Ng Sze Yeung Chris (51470300)
          <br />Pang Chun Lam (55750220)
          <br />Yeung Chun Ho (55749780)
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-divider class="primary my-4"></v-divider>
    </v-flex>
    <v-flex xs12>
      <v-container grid-list-md class="px-0">
        <v-layout>
          <v-flex xs12 md6>
            <v-card>
              <v-card-title>
                <div class="headline">Model 1</div>
              </v-card-title>
              <v-card-text>
                <v-treeview :items="model1" dense open-on-click open-all activatable>
                  <template v-slot:prepend="{ item, open }">
                    <v-icon color="primary">{{getIcon(item)}}</v-icon>
                  </template>
                </v-treeview>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 md6>
            <v-card>
              <v-card-title>
                <div class="headline">
                  Model 2
                  <v-icon color="primary">mdi-check</v-icon>
                </div>
              </v-card-title>
              <v-card-text>
                <v-treeview :items="model2" dense open-on-click open-all activatable>
                  <template v-slot:prepend="{ item, open }">
                    <v-icon color="primary">{{getIcon(item)}}</v-icon>
                  </template>
                </v-treeview>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    let id = 0;
    return {
      model1: [
        {
          id: ++id,
          name: "departments",
          collection: true,
          children: [
            {
              id: ++id,
              name: "_id: ObjectId",
              key: true
            },
            {
              id: ++id,
              name: 'deptId: "CS"',
              unique: true
            },
            {
              id: ++id,
              name: 'deptName: "Computer Science"'
            },
            {
              id: ++id,
              name: 'location: "Green Zone"'
            }
          ]
        },
        {
          id: ++id,
          name: "courses",
          collection: true,
          children: [
            {
              id: ++id,
              name: "_id: ObjectId",
              key: true
            },
            {
              id: ++id,
              name: 'courseId: "CS101"',
              unique: true
            },
            {
              id: ++id,
              name: 'title: "Introduction to Data Science"'
            },
            {
              id: ++id,
              name: "level: 6"
            },
            {
              id: ++id,
              name: "department: ObjectId(department._id)"
            }
          ]
        },
        {
          id: ++id,
          name: "offer",
          collection: true,
          children: [
            {
              id: ++id,
              name: "_id: ObjectId",
              key: true
            },
            {
              id: ++id,
              name: "course: ObjectId(course._id)",
              unique: true
            },
            {
              id: ++id,
              name: "year: 2016",
              unique: true
            },
            {
              id: ++id,
              name: "classSize: 40"
            },
            {
              id: ++id,
              name: "availablePlaces: 39"
            },
            {
              id: ++id,
              name: "enrolledCount: 1"
            }
          ]
        },
        {
          id: ++id,
          name: "students",
          collection: true,
          children: [
            {
              id: ++id,
              name: '_id: "15101010"',
              key: true
            },
            {
              id: ++id,
              name: 'stuName: "Chan Tai Man"'
            },
            {
              id: ++id,
              name: 'dOB: new Date("1997-05-15")'
            },
            {
              id: ++id,
              name: "enrolled",
              children: [
                {
                  id: ++id,
                  name: "0",
                  children: [
                    {
                      id: ++id,
                      name: "courseID: ObjectId(course._id)"
                    },
                    {
                      id: ++id,
                      name: 'enrolDate: new Date("2016-05-15 08:30:00")'
                    }
                  ]
                },
                {
                  id: ++id,
                  name: "1",
                  children: [
                    {
                      id: ++id,
                      name: "courseID: ObjectId(course._id)"
                    },
                    {
                      id: ++id,
                      name: 'enrolDate: new Date("2017-05-15 10:30:00")'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      model2: [
        {
          id: ++id,
          name: "departments",
          collection: true,
          children: [
            {
              id: ++id,
              name: "_id: ObjectId",
              key: true
            },
            {
              id: ++id,
              name: 'deptId: "CS"',
              unique: true
            },
            {
              id: ++id,
              name: 'deptName: "Computer Science"'
            },
            {
              id: ++id,
              name: 'location: "Green Zone"'
            },
            {
              id: ++id,
              name: "courses",
              children: [
                {
                  id: ++id,
                  name: "0",
                  children: [
                    {
                      id: ++id,
                      name: 'courseId: "CS101"'
                    },
                    {
                      id: ++id,
                      name: 'title: "Introduction to Data Science"'
                    },
                    {
                      id: ++id,
                      name: "level: 6"
                    }
                  ]
                },
                {
                  id: ++id,
                  name: "1",
                  children: [
                    {
                      id: ++id,
                      name: 'courseId: "CS102"'
                    },
                    {
                      id: ++id,
                      name: 'title: "Introduction to Computer Science"'
                    },
                    {
                      id: ++id,
                      name: "level: 5"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: ++id,
          name: "offer",
          collection: true,
          children: [
            {
              id: ++id,
              name: "_id: ObjectId",
              key: true
            },
            {
              id: ++id,
              name: "course",
              children: [
                {
                  id: ++id,
                  name: 'courseId: "CS101"',
                  unique: true
                },
                {
                  id: ++id,
                  name: 'title: "Introduction to Data Science"'
                },
                {
                  id: ++id,
                  name: "level: 6"
                }
              ]
            },
            {
              id: ++id,
              name: "year: 2016",
              unique: true
            },
            {
              id: ++id,
              name: "department: ObjectId(department._id)"
            },
            {
              id: ++id,
              name: "classSize: 40"
            },
            {
              id: ++id,
              name: "availablePlaces: 39"
            },
            {
              id: ++id,
              name: "enrolledCount: 1"
            },
            {
              id: ++id,
              name: "enrolled",
              children: [
                {
                  id: ++id,
                  name: "0",
                  children: [
                    {
                      id: ++id,
                      name: 'student: "15101010"'
                    },
                    {
                      id: ++id,
                      name: 'enrolDate: new Date("2016-05-15 08:30:00")'
                    }
                  ]
                },
                {
                  id: ++id,
                  name: "1",
                  children: [
                    {
                      id: ++id,
                      name: 'student: "15101011"'
                    },
                    {
                      id: ++id,
                      name: 'enrolDate: new Date("2017-05-15 10:30:00")'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: ++id,
          name: "students",
          collection: true,
          children: [
            {
              id: ++id,
              name: '_id: "15101010"',
              key: true
            },
            {
              id: ++id,
              name: 'stuName: "Chan Tai Man"'
            },
            {
              id: ++id,
              name: 'dOB: new Date("1997-05-15")'
            }
          ]
        }
      ]
    };
  },
  methods: {
    getIcon(item) {
      if (item.collection) return "mdi-database";
      if (item.unique) return "mdi-alpha-u-box";
      if (item.key) return "mdi-key";
    }
  }
};
</script>
