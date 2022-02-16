%%%-------------------------------------------------------------------
%% @doc battleship_server_erlang public API
%% @end
%%%-------------------------------------------------------------------

-module(battleship_server_erlang_app).

-behaviour(application).

-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
    Dispatch = cowboy_router:compile([
        {'_', [{"/ws/battleship", web_socket_handler, {} }]}
    ]),
    {ok, _} = cowboy:start_clear(http_listener,
        [{port, 8090}],
        #{env => #{dispatch => Dispatch}}
    ),
    UsersHandler = spawn(users_handler, init_server, []),
    register(online_users, UsersHandler),
    io:format("Server of online users has PID ~w ~n", [UsersHandler]),
    battleship_server_erlang_sup:start_link().

stop(_State) ->
    online_users ! {self(), stop},
    ok.

%% internal functions
